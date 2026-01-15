const hours = [
    {
        day: "Sunday",
        display: "12:00 PM – 6:00 PM",
        opens: "12:00",
        closes: "18:00",
    },
    {
        day: "Monday",
        display: "9:00 AM – 6:00 PM",
        opens: "09:00",
        closes: "18:00",
    },
    {
        day: "Tuesday",
        display: "Closed",
        opens: null,
        closes: null,
    },
    {
        day: "Wednesday",
        display: "9:00 AM – 6:00 PM",
        opens: "09:00",
        closes: "18:00",
    },
    {
        day: "Thursday",
        display: "9:00 AM – 6:00 PM",
        opens: "09:00",
        closes: "18:00",
    },
    {
        day: "Friday",
        display: "8:00 AM – 7:00 PM",
        opens: "08:00",
        closes: "19:00",
    },
    {
        day: "Saturday",
        display: "8:00 AM – 7:00 PM",
        opens: "08:00",
        closes: "19:00",
    },
];

module.exports = {
    name: "Code Stitch Web Designs",
    email: "help@codestitch.app",
    phoneForTel: "555-779-4407",
    phoneFormatted: "(555) 779-4407",
    address: {
        lineOne: "5470 Memorial Dr",
        lineTwo: "",
        city: "Stone Mountain",
        state: "GA",
        zip: "30083",
        country: "US",
        mapLink: "https://maps.google.com/?q=5470+Memorial+Dr,+Stone+Mountain,+GA+30083",
    },
    hours,
    schemaHours: hours.filter((hour) => hour.opens && hour.closes),
    socials: {
        facebook: "https://www.facebook.com/",
        instagram: "https://www.instagram.com/",
    },
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    domain: "https://www.example.com",
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
