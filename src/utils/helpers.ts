import moment from "moment";

export const getRandomColor = (): string => {
  const hexColors = [
    "#87A2FF",
    "#A5B68D",
    "#987D9A",
    "#B3A398",
    "#FF6969",
    "#DFA67B",
    "#A7727D",
    "#E3C770",
  ];

  return hexColors[Math.floor(Math.random() * hexColors.length)];
};

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const numberToDay = (dayIndex: number): string => {
  return days[dayIndex];
};

export const formatNumberToDateWithHoursAndMinutes = (d: number): string => {
  return moment(d).format("lll");
};

export const formatNumberToDate = (d: number): string => {
  return moment(d).format("MMM Do YY");
};

export const formatDateObjectToString = (date: {
  year: number;
  month: number;
  date: number;
}): string => {
  return `${date.year}-${date.month < 10 ? "0" + date.month : date.month}-${date.date < 10 ? "0" + date.date : date.date}`;
};

export const getHoursIndexOfDate = (dateInString: string): number =>
  new Date(dateInString).getHours();

export const userTypes = [
  { label: "User", value: "user" },
  { label: "Administrator", value: "admin" },
];

export const time = [
  { label: "6:00 AM", indexValue: 6 },
  { label: "7:00 AM", indexValue: 7 },
  { label: "8:00 AM", indexValue: 8 },
  { label: "9:00 AM", indexValue: 9 },
  { label: "10:00 AM", indexValue: 10 },
  { label: "11:00 AM", indexValue: 11 },
  { label: "12:00 NN", indexValue: 12 },
  { label: "1:00 PM", indexValue: 13 },
  { label: "2:00 PM", indexValue: 14 },
  { label: "3:00 PM", indexValue: 15 },
  { label: "4:00 PM", indexValue: 16 },
  { label: "5:00 PM", indexValue: 17 },
  { label: "6:00 PM", indexValue: 18 },
  { label: "7:00 PM", indexValue: 19 },
  { label: "8:00 PM", indexValue: 20 },
  { label: "9:00 PM", indexValue: 21 },
  { label: "10:00 PM", indexValue: 22 },
  { label: "11:00 PM", indexValue: 23 },
];

export const getTimeLabel = (index: number): string => {
    return time.find((time) => time.indexValue === index)!.label;
};

export const getDateTime = (date: string, hourIndex: number): number => {
  const dateObject = new Date(date);
  dateObject.setHours(hourIndex);
  return dateObject.getTime();
};

export const getDeptAcronym = (departMentName: string): string => {
  const dept = {
    "COD (Corporate Office Department)": "COD Dept",
    "CPI (Commercial Property Investment)": "CPI",
    "CRD (Commercial Retail/Industrial Department)": "CRD",
    "Finance and Admin Department": "Finance & Admin",
    "GW (GreatWork)": "GW",
    "HR Department": "HR",
    "Information Technology Department": "IT",
    "LR ( Landlord Representation Team": "LR",
    "Marketing Department": "Marketing Dept.",
  };

  return dept[departMentName as keyof typeof dept];
};
