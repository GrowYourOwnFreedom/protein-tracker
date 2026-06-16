export default function downloadTextFile(
    content: string,
    filename: string,
    mimeType: string,
): void {
    // create file-like object out of content
    const blob = new Blob([content], { type: mimeType });
    // create temporary url and point it at blob object
    const url = URL.createObjectURL(blob)
    // create invisible link 
    const link = document.createElement("a")
    // assign url to link
    link.href = url
    // tell link to create a download with filename as the name
    link.download = filename
    // append link to the DOM
    document.body.appendChild(link)
    // programatically click link
    link.click()
    // remove it from the DOM
    link.remove()
    // get rid of temp url
    URL.revokeObjectURL(url)

}
