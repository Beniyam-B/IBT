"use client";

import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => <div style={{ height: 320, background: "var(--bg-soft)", borderRadius: 8 }} aria-hidden="true" />,
});

export default function MapPanel(props) {
  return <DeliveryMap {...props} />;
}