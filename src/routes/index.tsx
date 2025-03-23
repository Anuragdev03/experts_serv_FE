import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";
// import HomePage from "../features/Homepage";
// import Login from "../features/auth/Login";
// import SignUp from "../features/auth/SignUp";
// import ForgotPassword from "../features/auth/ForgotPassword";
// import ErrorBoundary from "./ErrorBoundary"
// import NotFound from "./NotFound";
// import Dashboard from "../features/dashboard";
// import ProtectedRoute from "../authProvider/ProtectedRoute";
// import ExpertsList from "../features/expertsList";
// import CustomerProfile from "../features/customerProfile";
// import ExpertProfile from "../features/expertProfile";
// import ViewProfile from "../features/viewProfile";
// import RequestScreen from "../features/requestscreen";
// import ExpertLayout from "../layouts/ExpertLayout";
// import CustomerRequest from "../features/customerRequest";
// import ExpertResponse from "../features/expertResponse";
// import TrackRequest from "../features/trackRequest";
// import Events from "../features/events";
// import Tasks from "../features/tasks";
// import EditTask from "../features/tasks/EditTask";
// import Notifications from "../features/notifications";
// import Settings from "../features/settings";

import Loader from "../components/Loader";
const HomePage = lazy(() => import("../features/Homepage"));
const Login = lazy(() => import("../features/auth/Login"));
const SignUp = lazy(() => import("../features/auth/SignUp"));
const ForgotPassword = lazy(() => import("../features/auth/ForgotPassword"));
const ErrorBoundary = lazy(() => import("./ErrorBoundary"));
const NotFound = lazy(() => import("./NotFound"));
const Dashboard = lazy(() => import("../features/dashboard"));
const ProtectedRoute = lazy(() => import("../authProvider/ProtectedRoute"));
const ExpertsList = lazy(() => import("../features/expertsList"));
const CustomerProfile = lazy(() => import("../features/customerProfile"));
const ExpertProfile = lazy(() => import("../features/expertProfile"));
const ViewProfile = lazy(() => import("../features/viewProfile"));
const RequestScreen = lazy(() => import("../features/requestscreen"));
const ExpertLayout = lazy(() => import("../layouts/ExpertLayout"));
const CustomerRequest = lazy(() => import("../features/customerRequest"));
const ExpertResponse = lazy(() => import("../features/expertResponse"));
const TrackRequest = lazy(() => import("../features/trackRequest"));
const Events = lazy(() => import("../features/events"));
const Tasks = lazy(() => import("../features/tasks"));
const EditTask = lazy(() => import("../features/tasks/EditTask"));
const Notifications = lazy(() => import("../features/notifications"));
const Settings = lazy(() => import("../features/settings"));

export default function RouteWrapper() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<Loader loading />}>
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
                        <Route path="/expert-response/:url" element={<ExpertLayout><ExpertResponse /></ExpertLayout>} />
                        <Route path="/events" element={<ExpertLayout><Events /></ExpertLayout>} />
                        <Route path="/tasks" element={<ExpertLayout><Tasks /></ExpertLayout>} />
                        <Route path="/edit-task/:id" element={<ExpertLayout><EditTask /></ExpertLayout>} />
                        <Route path="/notifications" element={<ExpertLayout><Notifications /></ExpertLayout>} />
                        <Route path="/settings" element={<ExpertLayout><Settings /></ExpertLayout>} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    )
}