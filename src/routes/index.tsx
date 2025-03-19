import { Route, Routes } from "react-router";
import HomePage from "../features/Homepage";
import Login from "../features/auth/Login";
import SignUp from "../features/auth/SignUp";
import ForgotPassword from "../features/auth/ForgotPassword";
import ErrorBoundary from "./ErrorBoundary"
import NotFound from "./NotFound";
import Dashboard from "../features/dashboard";
import ProtectedRoute from "../authProvider/ProtectedRoute";
import ExpertsList from "../features/expertsList";
import CustomerProfile from "../features/customerProfile";
import ExpertProfile from "../features/expertProfile";
import ViewProfile from "../features/viewProfile";
import RequestScreen from "../features/requestscreen";
import ExpertLayout from "../layouts/ExpertLayout";
import CustomerRequest from "../features/customerRequest";
import ExpertResponse from "../features/expertResponse";
import TrackRequest from "../features/trackRequest";
import Events from "../features/events";
import Tasks from "../features/tasks";
import EditTask from "../features/tasks/EditTask";
import Notifications from "../features/notifications";
import Settings from "../features/settings";

export default function RouteWrapper() {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/experts" element={<ExpertsList />} />
                <Route path="/customer-profile" element={<CustomerProfile />} />
                <Route path="/view-profile/:url" element={<ViewProfile />} />
                <Route path="/request-screen/:user_name" element={<RequestScreen />} />
                <Route path="/track" element={<TrackRequest />} />
                <Route path="/track/:link" element={<TrackRequest />} />

                {/*  Protected Route */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<ExpertLayout><Dashboard /></ExpertLayout>} />
                    <Route path="/expert-profile" element={<ExpertLayout><ExpertProfile /></ExpertLayout>} />
                    <Route path="/customer-request" element={<ExpertLayout><CustomerRequest /></ExpertLayout>} />
                    <Route path="/expert-response/:url" element ={<ExpertLayout><ExpertResponse /></ExpertLayout>}  />
                    <Route path ="/events" element={<ExpertLayout><Events /></ExpertLayout>} />
                    <Route path ="/tasks" element={<ExpertLayout><Tasks /></ExpertLayout>} />
                    <Route path ="/edit-task/:id" element={<ExpertLayout><EditTask /></ExpertLayout>} />
                    <Route path="/notifications" element={<ExpertLayout><Notifications /></ExpertLayout>} />
                    <Route path="/settings" element={<ExpertLayout><Settings /></ExpertLayout>} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </ErrorBoundary>
    )
}