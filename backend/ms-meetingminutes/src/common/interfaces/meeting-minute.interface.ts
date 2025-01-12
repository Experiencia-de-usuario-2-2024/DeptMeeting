export interface IMeetingMinute extends Document {
    title: string;
    place: string;
    startTime: string;
    endTime: string;
    vote: string;
    isApproved: boolean;
    topics: any;
    links: any;
    meeting: any;
  }
  