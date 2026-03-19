import { Truck, Shield, RotateCcw, Lock } from "lucide-react";
import styles from "./TrustBar.module.scss";

const trustItems = [
  { icon: Truck, label: "Free Shipping", sub: "On orders over ₹499" },
  { icon: Shield, label: "Safe & Non-Toxic", sub: "Certified materials" },
  { icon: RotateCcw, label: "Easy Returns", sub: "30-day guarantee" },
  { icon: Lock, label: "Secure Checkout", sub: "SSL encrypted" },
];

export default function TrustBar() {
  return (
    <section className={styles.trustBar}>
      <div className={`container ${styles.container}`}>
        {trustItems.map((item) => (
          <div key={item.label} className={styles.item}>
            <div className={styles.iconWrap}>
              <item.icon size={22} />
            </div>
            <div className={styles.text}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.sub}>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
