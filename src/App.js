import { Fragment } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Params,
} from "react-router-dom";
import "./index.css";
import "./App.css";
import NotFoundPage from "./main/app_modules/404";
import Home from "./main/home/home";
import ViewRequest from "./main/ViewRequest";


const router = createBrowserRouter([
  { path: '*', element: <NotFoundPage /> }, // This catches all undefined routes
  {path: '/', element: <Home/>},
  {path: '/view/:encodedData', element: <ViewRequest/>}
]);


function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;