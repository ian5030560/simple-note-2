export default function makeTimeString(differ: number): string {
    let seconds = differ / 1000;
    if(seconds < 60){
        return "just now";
    }
    else if(seconds >= 60 && seconds < 60 * 60){
        let minutes = Math.floor(seconds / 60);
        if(minutes === 1){
            return "1 minute ago";
        }
        else{
            return `${minutes} minutes ago`;
        }
    }
    else if(seconds >= 60 * 60 && seconds < 60 * 60 * 24){
        let hours = Math.floor(seconds / (60 * 60));
        if(hours === 1){
            return `${hours} hour ago`;
        }
        else{
            return `${hours} hours ago`;
        }
    }
    else{
        let days = Math.floor(seconds / (60 * 60 * 24));
        if(days === 1){
            return `${days} day ago`;
        }
        else{
            return `${days} days ago`;
        }
    }
}