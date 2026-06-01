import { supabase } from '@/lib/supabaseClient';

class EntityShim {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async create(data) {
        const user = (await supabase.auth.getSession()).data.session?.user;
        if (!user) throw new Error("User not authenticated");
        
        const { data: created, error } = await supabase
            .from(this.tableName)
            .insert([{ ...data, user_id: user.id }])
            .select()
            .single();
            
        if (error) throw error;
        return created;
    }

    async update(id, data) {
        const { data: updated, error } = await supabase
            .from(this.tableName)
            .update(data)
            .eq('id', id)
            .select()
            .single();
            
        if (error) throw error;
        return updated;
    }

    async delete(id) {
        const { error } = await supabase
            .from(this.tableName)
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        return true;
    }

    async filter(criteria, orderBy = null, limit = null) {
        let query = supabase.from(this.tableName).select('*');
        for (const [key, value] of Object.entries(criteria)) {
            query = query.eq(key, value);
        }
        
        if (orderBy) {
            const isDesc = orderBy.startsWith('-');
            const col = isDesc ? orderBy.substring(1) : orderBy;
            // map 'created_date' to 'created_at' if needed, though supabase uses created_at.
            const column = col === 'created_date' ? 'created_at' : col;
            query = query.order(column, { ascending: !isDesc });
        }
        
        if (limit) {
            query = query.limit(limit);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    }

    async list(orderBy = null, limit = null) {
        return this.filter({}, orderBy, limit);
    }

    subscribe(callback) {
        const channel = supabase.channel(`public:${this.tableName}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: this.tableName }, payload => {
                let type = 'update';
                if (payload.eventType === 'INSERT') type = 'create';
                if (payload.eventType === 'DELETE') type = 'delete';
                
                callback({
                    type,
                    id: payload.old?.id || payload.new?.id,
                    data: payload.new
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }
}

export const base44 = {
    entities: {
        Favorite: new EntityShim('favorites'),
        Reservation: new EntityShim('reservations'),
        Message: new EntityShim('messages'),
        Order: new EntityShim('orders')
    }
};

