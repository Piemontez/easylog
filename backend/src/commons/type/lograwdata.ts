type LogRawData = {
  index: string;
  time: string | Date;
  data: Record<string, any> | string;
};

export default LogRawData;
