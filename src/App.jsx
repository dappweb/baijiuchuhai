import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";
import Layout from "./components/Layout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";

function App() {
  return (
    <Switch>
      <Route path="/admin/login" component={Login} />
      <Route path="/admin" component={Dashboard} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/news" component={News} />
            <Route path="/news/:id" component={NewsDetail} />
            <Route path="/contact" component={Contact} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

export default App;
