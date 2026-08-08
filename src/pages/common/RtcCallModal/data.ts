import { SignalingInvitation, SignalingParticipantInfo } from "@openim/wasm-client-sdk";

export interface InviteData {
  invitation?: SignalingInvitation;
  participant?: SignalingParticipantInfo;
  isJoin?: boolean;
}

export interface AuthData {
  serverUrl: string;
  token: string;
}
