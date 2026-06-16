export default function hasErrors(errors): boolean {
    return Object.values(errors).some((error) => {
        return error !== "";
    });
}