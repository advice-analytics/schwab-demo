import { EVENT_CONSTANTS } from "@/constants/utils";

class LoaderService {
  showLoader(show: boolean = false) {
    const event: any = document.createEvent('Event');
    event.initEvent(EVENT_CONSTANTS.loaderEvent, true, true);
    event['showLoader'] = show;
    document.dispatchEvent(event);
  }
}

const loaderService = new LoaderService();

export default loaderService;
