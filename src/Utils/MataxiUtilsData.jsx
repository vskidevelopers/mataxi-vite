import amico from "../assets/images/amico.png";
import tripImg from "../assets/images/cuate.png";
import carDriving from "../assets/images/car-driving-booking.png";
import nairobi from "../assets/destinations/nairobi.png";
import mombasa from "../assets/destinations/mombasa.png";
import naivasha from "../assets/destinations/naivasha.png";
import nakuru from "../assets/destinations/nakuru.png";
import busia from "../assets/destinations/busia.png";
import thika from "../assets/destinations/thika.png";

import kesIcon from "../assets/images/kes.png";
import usdcIcon from "../assets/images/usdc.png";
import btcIcon from "../assets/images/btc.png";
import xlmIcon from "../assets/images/xlm.png";
import tzsIcon from "../assets/images/tzs.png";
import ngncIcon from "../assets/images/ngnc.png";

export const welcomeScreensData = [
  {
    id: "welcome-to-mataxi",
    title: "Welcome to Mataxi",
    message:
      "The hassle-free travel platform that digitizes public transport and makes payment easy. With Mataxi, you can schedule your travel plans, book seats, and trade seats if you need to.",
    svgSrc: tripImg,
    screenHref: "welcome-screen-1",
    screenTarget: "Get Started",
    nextHref: "/welcome-screen/find-your-routes",
    prevHref: "/welcome-screen/welcome-to-mataxi",
  },
  {
    id: "find-your-routes",
    title: "Finding Your Routes Made Easy",
    message:
      "Effortlessly explore and book your preferred route with Mataxi. Compare schedules, prices, and trip details to make an informed decision. Simply select and let us take you there",
    svgSrc: amico,
    screenHref: "welcome-screen-2",
    screenTarget: "Book now",
    nextHref: "/welcome-screen/booking-made-simple",
    prevHref: "/welcome-screen/welcome-to-mataxi",
  },
  {
    id: "booking-made-simple",
    title: "Booking Made Simple",
    message:
      "Booking with Mataxi is easy. Choose your transport mode, select a seat, and make a secure payment. Opt for carpooling options for an affordable and fun ride",
    svgSrc: carDriving,
    screenHref: "welcome-screen-3",
    screenTarget: "Find a ride",
    nextHref: "/home",
    prevHref: "/welcome-screen/find-your-routes",
  },
];

export const homeInfoCardsData = [
  {
    title: "Book Trip",
    content: "Booking a new trip with Mataxi is quick and easy",
    button: "Book Now",
    link: `/settings/rider/book-trip`,
  },
  {
    title: "My Trips",
    content:
      "Easily keep track of all the trips you've booked through our platform.",
    button: "Plan Trip",
  },
  {
    title: "Discover Trips",
    content:
      "Browse through our curated collection of trips and discover new places to explore.",
    button: "Start Exploring",
  },
  {
    title: "Carpool",
    content:
      "Easily search and connect with other travelers going in the same direction",
    button: "Get Started",
  },
];

export const topDestionationData = [
  {
    name: "Nairobi",
    imageSrc: nairobi,
  },
  {
    name: "Mombasa",
    imageSrc: mombasa,
  },
  {
    name: "Naivasha",
    imageSrc: naivasha,
  },
  {
    name: "Nakuru",
    imageSrc: nakuru,
  },
  {
    name: "Busia",
    imageSrc: busia,
  },
  {
    name: "Thika",
    imageSrc: thika,
  },
];

export const assets = [
  {
    code: "KES",
    fullName: "Kenya Shilling",
    icon: kesIcon,
    domain: "clickpesa",
  },
  {
    code: "USDC",
    fullName: "US Dollar Coin",
    icon: usdcIcon,
    domain: "ultrastellar",
  },
  { code: "BTC", fullName: "Bitcoin", icon: btcIcon, domain: "ultrastellar" },
  { code: "XLM", fullName: "Stellar", icon: xlmIcon, domain: "ultrastellar" },
  {
    code: "TZS",
    fullName: "Tanzania Shilling",
    icon: tzsIcon,
    domain: "clickpesa",
  },
  { code: "NGNC", fullName: "Nigerian Coin", icon: ngncIcon, domain: "anclap" },
];
