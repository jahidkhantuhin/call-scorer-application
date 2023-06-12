export default function exportTableToExcel(tableID: string, filename = "") {
  if (process.browser) {
    var elt = document.getElementById(tableID);
    var wb = (window as any).XLSX.utils.table_to_book(elt, {
      sheet: "Sheet JS",
    });

    return (window as any).XLSX.writeFile(wb, `${filename}.xlsx`);
  }
}
