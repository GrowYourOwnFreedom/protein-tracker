  function getToday():string {
            const dateNow = new Date();
            const year = String(dateNow.getFullYear());
            const month = String(dateNow.getMonth() + 1).padStart(2, "0");
            const day = String(dateNow.getDate()).padStart(2,"0")            
            const today = `${year}-${month}-${day}`;
            return today;
        }
        export {getToday}