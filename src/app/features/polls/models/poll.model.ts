export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: Date;
  closed: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}