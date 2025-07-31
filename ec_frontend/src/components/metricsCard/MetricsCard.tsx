import type { ReactElement } from "react";
import styles from "./styles/MetricsCard.module.scss";
import type MetricsCardProps from "./MetricsCard.types";

export default function MetricsCard({
  value,
  label,
}: MetricsCardProps): ReactElement {
  return (
    <>
      <div className={styles.wrapper}>
        <h1 className={styles.value}>{value}</h1>
        <p className={styles.label}>{label}</p>
      </div>
    </>
  );
}
