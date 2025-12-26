import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/seat-selection/:movieId/:showtimeId" element={<SeatSelection />} />
          <Route path="/payment/:movieId/:showtimeId" element={<Payment />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
