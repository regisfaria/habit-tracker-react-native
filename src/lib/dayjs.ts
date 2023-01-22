import dayjs from "dayjs";
import "dayjs/locale/en";
import utc from "dayjs/plugin/utc";

dayjs.locale("en");

dayjs.extend(utc);
