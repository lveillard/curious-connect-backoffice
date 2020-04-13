/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import TimeLine from "views/TimeLine.js";
import Profile from "views/examples/Profile"



var routes = [
  {
    path: "/index",
    name: "Timeline",
    icon: "ni ni-tv-2 text-primary",
    component: TimeLine,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin"
  }
]

  /*
  var test = [
    {
      path: "/index",
      name: "Timeline",
      icon: "ni ni-tv-2 text-primary",
      component: Index,
      layout: "/admin"
    },
    {
      path: "/user-profile",
      name: "User Profile",
      icon: "ni ni-single-02 text-yellow",
      component: Profile,
      layout: "/admin"
    }]
  */
  ;
export default routes;
