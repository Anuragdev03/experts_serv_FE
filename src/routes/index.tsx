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

export default function RouteWrapper() {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/experts" element={<ExpertsList />} />
                <Route path="/customer-profile" element={<CustomerProfile />}  />

                {/*  Protected Route */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </ErrorBoundary>
    )
}