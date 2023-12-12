import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "../components/barComponents/Navbar";
import Main from "../pages/main";
import { setupServer } from "msw/node";
import ClassCard from "../components/classes/ClassCard";
import SlackLoginButton from "../components/auth-components/SlackLoginButton";

describe("Navbar Component", () => {
  test("should render Navbar component", () => {
    render(<Navbar />);
    const navbarElement = screen.getByTestId("navbar"); 
    expect(navbarElement).toBeInTheDocument();
  });

  test("should handle search input", () => {
    render(<Navbar />);
    const searchInput = screen.getByPlaceholderText("Search…");
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput.value).toBe("test");
  });

  test("should render AdminButton", () => {
    render(<Navbar />);
    const adminButton = screen.getByTestId("admin-button");
    expect(adminButton).toBeInTheDocument();
  });

  test("should open and close drawer", () => {
    render(<Navbar />);
    const hamburgerMenuButton = screen.getByLabelText("open drawer");

    fireEvent.click(hamburgerMenuButton); 
    const drawerElement = screen.getByTestId("drawer");
    expect(drawerElement).toBeInTheDocument();

    fireEvent.click(hamburgerMenuButton); 
    expect(drawerElement).not.toBeInTheDocument();
  });

});


const server = setupServer(
  rest.get(`${process.env.REACT_APP_BACKEND_URL}/session`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          date: '2023-12-11',
          time_start: '10:00',
          time_end: '12:00',
          who_leading: 'John Doe',
          city: 'Example City',
          location: 'Example Location',
          module_name: 'Example Module',
          module_week: 1,
          syllabus_link: 'https://example.com/syllabus',
        },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Main Component', () => {
  test('should render Main component', async () => {
    render(<Main />);
    const mainElement = screen.getByTestId('main');
    expect(mainElement).toBeInTheDocument();
  });

  test('should fetch and display data', async () => {
    render(<Main />);
    const classCardElement = await screen.findByTestId('class-card');
    expect(classCardElement).toBeInTheDocument();
  });

});

describe("SlackLoginButton Component", () => {
  test("renders SlackLoginButton component", () => {
    render(<SlackLoginButton />);
    const buttonElement = screen.getByLabelText("Login");
    expect(buttonElement).toBeInTheDocument();
  });

  test("clicking the button opens a popup", async () => {
    const mockOnLoged = jest.fn();
    const mockOnError = jest.fn();

    render(<SlackLoginButton onLoged={mockOnLoged} onError={mockOnError} />);
    const buttonElement = screen.getByLabelText("Login");

    fireEvent.click(buttonElement);

    // Wait for the popup to open
    await waitFor(() => {
      expect(window.open).toHaveBeenCalled();
    });

    // as JSDOM doesn't actually open new windows
    const mockWindowOpen = window.open;

    // Mocking the window.open function
    window.open = jest.fn();

    // Simulate a closed popup
    window.open.mockReturnValueOnce(null);


    // Reset the mock
    window.open = mockWindowOpen;
  });

  test("handles successful login", async () => {
    const mockOnLoged = jest.fn();
    const mockOnError = jest.fn();

    render(<SlackLoginButton onLoged={mockOnLoged} onError={mockOnError} />);
    const buttonElement = screen.getByLabelText("Login");

    fireEvent.click(buttonElement);

    // Wait for the popup to open
    await waitFor(() => {
      expect(window.open).toHaveBeenCalled();
    });

    // Mock the successful login scenario
    const mockWindowOpen = window.open;
    window.open = jest.fn().mockReturnValueOnce({
      closed: false,
      location: { search: "?code=testCode" },
    });

    // Trigger the polling logic (consider using jest.advanceTimersByTime)
    await waitFor(() => {
      expect(mockOnLoged).toHaveBeenCalledWith("testCode");
    });

    // Reset the mock
    window.open = mockWindowOpen;
  });

  test("handles popup closure", async () => {
    const mockOnLoged = jest.fn();
    const mockOnError = jest.fn();

    render(<SlackLoginButton onLoged={mockOnLoged} onError={mockOnError} />);
    const buttonElement = screen.getByLabelText("Login");

    fireEvent.click(buttonElement);

    // Wait for the popup to open
    await waitFor(() => {
      expect(window.open).toHaveBeenCalled();
    });

    // Mock the scenario where the popup is closed
    const mockWindowOpen = window.open;
    window.open = jest.fn().mockReturnValueOnce(null);

    // Trigger the polling logic (consider using jest.advanceTimersByTime)
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith("Popup has been closed by user");
    });

    // Reset the mock
    window.open = mockWindowOpen;
  });

});



describe("ClassCard Component", () => {
  const mockProps = {
    date: "2023-12-11",
    time_start: "10:00",
    time_end: "12:00",
    who_leading: "John Doe",
    city: "Example City",
    location: "Example Location",
    module_name: "Example Module",
    module_week: 1,
    syllabus_link: "https://example.com/syllabus",
    cohort: "Example Cohort",
    sessionId: 1,
  };

  test("renders ClassCard component with correct content", () => {
    render(<ClassCard {...mockProps} />);

    // Check if the rendered elements contain expected content
    expect(screen.getByText(/11/)).toBeInTheDocument(); // Check if the day is rendered
    expect(screen.getByText(/12/)).toBeInTheDocument(); // Check if the month is rendered
    expect(screen.getByText(/2023/)).toBeInTheDocument(); // Check if the year is rendered
    expect(screen.getByText(/10:00 - 12:00/)).toBeInTheDocument(); // Check if the time range is rendered
    expect(screen.getByText(/Example Module/)).toBeInTheDocument(); // Check if the module name is rendered
    expect(
      screen.getByText(/Example City/)
    ).toBeInTheDocument(); // Check if city 
    expect(screen.getByText(/Example Location/)).toBeInTheDocument(); // Check if location is rendered
    expect(screen.getByText(/Week 1/)).toBeInTheDocument(); // Check if the module week is rendered

  });
});
