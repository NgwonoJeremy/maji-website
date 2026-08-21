import Navbar from "../../components/Navbar";
import OrderWater from "./OrderWater";
import Payment from './Payment';
import OrderHistory from "./OrderHistory";
import Feedback from "./Feedback";
import TrackOrder from "./TrackOrder";

function CustomerDashboard() {
  return (
    <main className="dashboard-page">
      <section className="dashboard-frame">
        <Navbar />

        <div className="dashboard-content">
          <OrderWater />
          <Payment />
          <OrderHistory />
          <TrackOrder />
          <Feedback />
        </div>
      </section>
    </main>
  );
}

export default CustomerDashboard;
