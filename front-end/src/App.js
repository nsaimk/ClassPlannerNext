import "./App.css";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import MainRoutes from "./routes/MainRoutes";

function App() {
  return (
    <div className="App">
      <Header />
      <MainRoutes />
      {/* <Calendar /> */}
      <Footer />
    </div>
  );
}

export default App;
