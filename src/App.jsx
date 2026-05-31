import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LangProvider } from './lib/LangContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Series from './pages/Series';
import Profile from './pages/Profile';

import Payment from './pages/Payment';
import VideoPlayer from './pages/VideoPlayer';
import Reservations from './pages/Reservations';
import Menu from './pages/Menu';
import MyReservations from './pages/MyReservations';
import Settings from './pages/Settings';


const AuthenticatedApp = () => {
const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin }
= useAuth();


// Show loading spinner while checking app public settings or auth
if (isLoadingPublicSettings || isLoadingAuth) {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
         <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800
rounded-full animate-spin"></div>
        </div>
    );
}


// Handle authentication errors
if (authError) {
    if (authError.type === 'user_not_registered') {
        return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
        // Redirect to login automatically
        navigateToLogin();
        return null;
    }
}


// Render the main app
return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/series/:seriesName" element={<Series />} />

      <Route path="/provider/:providerId" element={<Profile />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/watch/:providerId/:episodeIndex" element={<VideoPlayer />}
/>
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/my-reservations" element={<MyReservations />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<PageNotFound />} />
     </Routes>
 );
};




function App() {


 return (
     <LangProvider>
     <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
            <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
     </AuthProvider>
     </LangProvider>
 )
}


export default App
