export const useGetDriveSessionsByTripQuery = jest.fn(() => ({ data: [], isLoading: false, refetch: jest.fn() }));
export const useStartDriveSessionMutation = jest.fn(() => [jest.fn(), { isLoading: false }]);
export const useEndDriveSessionMutation = jest.fn(() => [jest.fn(), { isLoading: false }]);