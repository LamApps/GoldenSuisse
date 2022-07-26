import { lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from 'react-redux';
import MinimalLayout from 'layout/MinimalLayout';
import MainLayout from 'layout/MainLayout';


// project imports
import Loadable from 'ui-component/Loadable';

// login option 3 routing
const Login = Loadable(lazy(() => import('../views/login')));

const Portfolio = Loadable(lazy(() => import('views/portfolio')));
const PortfolioGraph = Loadable(lazy(() => import('views/portfolio/PortfolioGraph')));
const Clients = Loadable(lazy(() => import('views/clients')));
const ClientDetails = Loadable(lazy(() => import('views/clients/ClientDetails')));
const ClientOverview = Loadable(lazy(() => import('views/clients/ClientOverview')));
const ClientGraph = Loadable(lazy(() => import('views/clients/ClientGraph')));
const ClientProfile = Loadable(lazy(() => import('views/clients/ClientProfile')));
const ClientReports = Loadable(lazy(() => import('views/clients/ClientReports')));
const ClientFees = Loadable(lazy(() => import('views/clients/ClientFees')));
const Chat = Loadable(lazy(() => import('views/chat')));
const Calendar = Loadable(lazy(() => import('views/calendar')));
const Email = Loadable(lazy(() => import('views/email')));

const Advisors = Loadable(lazy(() => import('views/advisors')));
const AdvisorView = Loadable(lazy(() => import('views/advisors/AdvisorView')));
const AdvisorEdit = Loadable(lazy(() => import('views/advisors/AdvisorEdit')));

const AppRoutes = () => {

    const auth = useSelector(state => state.auth);
    const role = auth.userData.role;
    console.log(role)
    return (
        <Routes>
            <Route exact path="/" element={<MinimalLayout/>} >
                <Route index element={
                    auth.accessToken === "" ? <Login /> : <Navigate to={role === 'admin' ? "/advisors" : "/portfolio"} />
                }/>
                <Route exact path="login" element={
                    auth.accessToken === "" ? <Login /> : <Navigate to={role === 'admin' ? "/advisors" : "/portfolio"} />
                } />
            </Route>
            <Route
                path="/"
                element={
                    auth.accessToken === "" ? <Navigate to="/login" /> : <MainLayout />
                }
            >
                {
                    role === 'admin' ? <>
                        <Route path="advisors" element={<Advisors />} />
                        <Route path="advisor/view/:id" element={<AdvisorView />} />
                        <Route path="advisor/edit/:id" element={<AdvisorEdit />} />
                    </> : <>
                        <Route path="portfolio" element={<Portfolio />} />
                        <Route exact path="portfolio/graph" element={<PortfolioGraph />} />
                        <Route path="clients" element={<Clients />} />
                        <Route path="chat" element={<Chat />} />
                        <Route path="calendar" element={<Calendar />} />
                        <Route path="email" element={<Email />} />
                    </>
                }
                <Route path="client/details" element={<ClientDetails />}>
                    <Route path="overview/:id" element={<ClientOverview />} />
                    <Route path="graph/:id" element={<ClientGraph />} />
                    <Route path="profile/:id" element={<ClientProfile />} />
                    <Route path="reports/:id" element={<ClientReports />} />
                    <Route path="fees/:id" element={<ClientFees />} />
                </Route>
            </Route>

        </Routes>
    );
};

export default AppRoutes;