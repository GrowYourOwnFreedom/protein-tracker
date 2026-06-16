import downloadTextFile from "@/lib/downloadTextFile"

export default function downloadJsonBackup(data:unknown,filename:string) {
    // turn data into readable string with 2 spaces of indentation for each nested level
    const json = JSON.stringify(data,null,2)
    console.log(filename);
    
    downloadTextFile(json, filename, "application/json")

}