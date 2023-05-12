export interface Talk {
  speaker: {
    name: string;
    avatar?: string;
  };
  title: string;
  duration: string;
  description: string;
  day: number;
}

export interface Conference {
  id: number;
  logo?: {
    src: string;
    title?: string;
  },
  title: string;
  startDateTime: string;
  endDateTime: string;
  shortDescription?: string;
  description: string;
  talks?: Talk[];
}
