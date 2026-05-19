import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

vi.mock("../../context/AuthContext.tsx", () => ({
  useAuth: () => ({
    user: {
      id: "1",
      role: "patient",
      first_name: "James",
      last_name: "Smith",
      email: "james@gmail.com",
    },
    setUser: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock("../../services", () => ({
  fetchAppointmentsAPI: vi.fn().mockResolvedValue([]),
  fetchClinicsAPI: vi.fn().mockResolvedValue([]),
  fetchServicesAPI: vi.fn().mockResolvedValue([]),
  fetchUsersAPI: vi.fn().mockResolvedValue([]),
}));

describe("Home", () => {
  it("renders upcoming appointments heading", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(getByText("Upcoming Appointments")).toBeDefined();
  });
});
