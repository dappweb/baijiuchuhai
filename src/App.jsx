import { Route, Router, Link } from "wouter";
import Home from "./pages/Home";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";
import Layout from "./components/Layout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import { SiteContentProvider } from "./contexts/SiteContentContext";

function App() {
  return (
    <SiteContentProvider>
      <Layout>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/news" component={News} />
          <Route path="/news/:id" component={NewsDetail} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin" component={Dashboard} />
          <Route path="/admin/login" component={Login} />
        </Router>
      </Layout>
    </SiteContentProvider>
  );
}

export default App;
