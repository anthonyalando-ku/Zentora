import { useMutation } from "@tanstack/react-query";
import { discoverySearchApi } from "@/core/api/services/discoverySearch";

export const useTrackSearchClick = () =>
  useMutation({
    mutationFn: discoverySearchApi.trackSearchClick,
  });