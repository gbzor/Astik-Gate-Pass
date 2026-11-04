const APPLICANTS = {
  1: {
    name: "Lorenzo Paulo Tandog",
    appliedAt: "Nov 2, 9:00pm",
    idNumber: "20240000",
    email: "lptandog@gbox.adnu.edu.ph",
    course: "BSIT",
    contact: "0910909090",
    affiliation: "STUDENT",

    vehicleType: "Motorcycle",
    brand: "Honda",
    plateNo: "NCC123",
    stickerRestriction: "Monday",
    stickerValidation: "2026-2027",

    requirements: {
      driversLicense: "",
      officialReceipt: "",
      schoolId: "",
      certificateOfRegistration: "",
    },
  },

  2: {
    name: "Maria Angelica Reyes",
    appliedAt: "Nov 3, 10:15am",
    idNumber: "20230142",
    email: "mareyes@gbox.adnu.edu.ph",
    course: "BS Nursing",
    contact: "09171234567",
    affiliation: "STUDENT",

    vehicleType: "Motorcycle",
    brand: "Yamaha",
    plateNo: "NBD482",
    stickerRestriction: "Tuesday",
    stickerValidation: "2026-2027",

    requirements: {
      driversLicense: "",
      officialReceipt: "",
      schoolId: "",
      certificateOfRegistration: "",
    },
  },

  3: {
    name: "John Carlo Villanueva",
    appliedAt: "Nov 3, 1:40pm",
    idNumber: "20220987",
    email: "jcvillanueva@gbox.adnu.edu.ph",
    course: "BS Civil Engineering",
    contact: "09283456721",
    affiliation: "STUDENT",

    vehicleType: "Car",
    brand: "Toyota",
    plateNo: "ABC1234",
    stickerRestriction: "Wednesday",
    stickerValidation: "2026-2027",

    requirements: {
      driversLicense: "",
      officialReceipt: "",
      schoolId: "",
      certificateOfRegistration: "",
    },
  },

  4: {
    name: "Patricia Mae Dela Cruz",
    appliedAt: "Nov 3, 4:25pm",
    idNumber: "20240318",
    email: "pmdelacruz@gbox.adnu.edu.ph",
    contact: "09451122334",
    affiliation: "FACULTY",

    vehicleType: "Motorcycle",
    brand: "Suzuki",
    plateNo: "NAE905",
    stickerRestriction: "Thursday",
    stickerValidation: "2026-2027",

    requirements: {
      driversLicense: "",
      officialReceipt: "",
      schoolId: "",
      certificateOfRegistration: "",
    },
  },

  5: {
    name: "Dr. Ramon Santos Bautista",
    appliedAt: "Nov 4, 8:30am",
    idNumber: "F-0045",
    email: "rsbautista@adnu.edu.ph",
    course: "",
    contact: "09175558899",
    affiliation: "FACULTY",

    vehicleType: "Car",
    brand: "Mitsubishi",
    plateNo: "DEF5678",
    stickerRestriction: "Friday",
    stickerValidation: "2026-2027",

    requirements: {
      driversLicense: "",
      officialReceipt: "",
      schoolId: "",
      certificateOfRegistration: "",
    },
  },

  6: {
    name: "Prof. Elena Marie Cortez",
    appliedAt: "Nov 4, 11:05am",
    idNumber: "F-0112",
    email: "emcortez@adnu.edu.ph",
    course: "",
    contact: "09336667788",
    affiliation: "FACULTY",

    vehicleType: "Motorcycle",
    brand: "Honda",
    plateNo: "NFG271",
    stickerRestriction: "Monday",
    stickerValidation: "2026-2027",

    requirements: {
      driversLicense: "",
      officialReceipt: "",
      schoolId: "",
      certificateOfRegistration: "",
    },
  },

  7: {
    name: "Kenneth Rae Salazar",
    appliedAt: "Nov 4, 2:50pm",
    idNumber: "20210654",
    email: "krsalazar@gbox.adnu.edu.ph",
    course: "BS Computer Science",
    contact: "09054443322",
    affiliation: "STUDENT",

    vehicleType: "Car",
    brand: "Nissan",
    plateNo: "GHI9012",
    stickerRestriction: "Tuesday",
    stickerValidation: "2026-2027",

    requirements: {
      driversLicense: "",
      officialReceipt: "",
      schoolId: "",
      certificateOfRegistration: "",
    },
  },
};

const DECISIONS_KEY = "astik_decisions";

function getDecisions() {
  try {
    return JSON.parse(localStorage.getItem(DECISIONS_KEY)) || {};
  } catch {
    return {};
  }
}

const ACTIVITY_KEY = "astik_activity";

function getActivity() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || [];
  } catch {
    return [];
  }
}

function setDecision(id, status) {
  const all = getDecisions();
  all[id] = status;
  localStorage.setItem(DECISIONS_KEY, JSON.stringify(all));
  const log = getActivity();
  log.unshift({ id, name: APPLICANTS[id].name, status, at: Date.now() });
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log.slice(0, 50)));
}