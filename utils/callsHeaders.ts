import translations from "~/translations";

export default [
  {
    text: translations.calls.score,
    align: "start",
    value: "actions",
    sortable: false,
    width: "120px",
  },
  { text: "Call ID", align: "start", value: "id", width: "90px" },
  {
    text: translations.calls.callerNumber,
    align: "start",
    value: "caller_number",
    width: "150px",
  },
  {
    text: translations.calls.callDate,
    align: "start",
    value: "call_start",
    width: "300px",
  },
  {
    text: "Duration",
    align: "start",
    value: "call_duration",
    width: "100px",
  },
  // {
  //   text: "Location",
  //   align: "start",
  //   value: "location.name",
  //   sortable: false,
  //   width: "250px",
  // },
  {
    text: translations.calls.rated,
    align: "start",
    value: "rated",
    sortable: false,
  },
  
];
