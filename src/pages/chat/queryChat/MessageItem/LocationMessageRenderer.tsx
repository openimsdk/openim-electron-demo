import { Image } from "antd";
import { FC } from "react";

import { IMessageItemProps } from ".";

export interface LocationDetails {
  name: string;
  latng: string;
  addr: string;
  city: string;
  module: string;
  latitude: number;
  longitude: number;
  url: string;
}

const LocationMessageRenderer: FC<IMessageItemProps> = ({ message }) => {
  let locationDetails = {} as LocationDetails;

  try {
    locationDetails = JSON.parse(message.locationElem.description);
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="w-60 cursor-pointer overflow-hidden rounded-md border border-[var(--gap-text)]">
      <div className="mx-3 mt-2 truncate">{locationDetails.name}</div>
      <div className="mx-3 mb-1 truncate text-xs text-[var(--sub-text)]">
        {locationDetails.addr}
      </div>
      <Image className="block" width={240} src={locationDetails.url} preview={false} />
    </div>
  );
};

export default LocationMessageRenderer;
