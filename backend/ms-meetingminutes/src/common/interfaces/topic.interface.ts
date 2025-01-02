export interface ITopic extends Document {
    proposed: string;
    accepted: string;
    description: string;
    inMeetingMinute: boolean;
    elements: string[];
    _id: string;
}
