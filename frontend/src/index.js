import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import SignUpPage from './pages/signup.jsx'
import Profile from './pages/profile.jsx'
import MySubgreddiitsPage from './pages/mySubgreddiitsPage'
import SubgreddiitAnalyticsPage from './pages/subgreddiitAnalyticsPage'
import AllSubgreddiitsPage from './pages/AllSubgreddiitsPage'
import SubgreddiitPage from './pages/subgreddiitPage'
import SavedPostsPage from './pages/savedPostsPage'

import {
	createBrowserRouter,
	RouterProvider,
}  from "react-router-dom"

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />
	}, 
	{
		path: "/login",
		element: <SignUpPage />
	},
	{
		path: "/profile",
		element: <Profile />
	},
	{
		path: "/mysubgreddiits",
		element: <MySubgreddiitsPage />
	},
	{
		path: "/subgreddiitAnalytics/:subgreddiitId",
		element: <SubgreddiitAnalyticsPage />
	},
	{
		path: '/subgreddiits',
		element: <AllSubgreddiitsPage />
	},
	{
		path: '/subgreddiitPage/:subgreddiitId',
		element: <SubgreddiitPage />
	},
	{
		path: '/savedPosts',
		element: <SavedPostsPage />
	}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<RouterProvider router={router}>
		
	</RouterProvider>
);