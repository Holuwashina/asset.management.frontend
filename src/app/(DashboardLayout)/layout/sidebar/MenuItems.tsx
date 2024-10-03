import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconForms,
  IconFlask,
  IconAlertCircle,
  IconAnalyze,
  IconRecharging,
  IconAlignBoxLeftStretch,
  IconListDetails 
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Asset Classification",
  },
  {
    id: uniqueId(),
    title: "Asset Entry Form",
    icon: IconForms,
    href: "/classification/asset-form",
  },
  {
    id: uniqueId(),
    title: "Assets Listing",
    icon: IconTypography,
    href: "/classification/assets",
  },
  {
    id: uniqueId(),
    title: "Asset Classification",
    icon: IconFlask,
    href: "/classification/asset-classify",
  },
  {
    navlabel: true,
    subheader: "Risk Identification",
  },
  {
    id: uniqueId(),
    title: "Risk Identification",
    icon: IconAlertCircle,
    href: "/classification/risk-identification",
  },
  {
    navlabel: true,
    subheader: "Risk Analysis",
  },
  {
    id: uniqueId(),
    title: "Risk Analysis",
    icon: IconAnalyze ,
    href: "/classification/risk-analysis",
  },
  {
    navlabel: true,
    subheader: "Risk Handling",
  },
  {
    id: uniqueId(),
    title: "Risk Handling",
    icon: IconRecharging,
    href: "/classification/risk-handling",
  },
  {
    navlabel: true,
    subheader: "Performance Metrics",
  },
  {
    id: uniqueId(),
    title: "Model Metrics",
    icon: IconRecharging,
    href: "/classification/model-metrics",
  },
  {
    navlabel: true,
    subheader: "Settings",
  },
  {
    id: uniqueId(),
    title: "Asset Assessments",
    icon: IconAlignBoxLeftStretch,
    href: "/settings/asset-assessment",
  },
  {
    id: uniqueId(),
    title: "Assessment Form",
    icon: IconListDetails ,
    href: "/settings/assessment-form",
  },
];

export default Menuitems;
