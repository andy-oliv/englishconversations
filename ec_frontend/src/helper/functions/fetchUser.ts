import axios from "axios";
import { UserSchema } from "../../schemas/user.schema";
import { UserStore } from "../../stores/userStore";

export async function fetchUser(id: string): Promise<void> {
  const cachedUser: string | null = sessionStorage.getItem("user");
  if (cachedUser) {
    const parsedUser = UserSchema.safeParse(JSON.parse(cachedUser));

    if (parsedUser.success) {
      UserStore.getState().setUser(parsedUser.data);
      return;
    }
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/users/${id}`, {
      withCredentials: true,
    });

    console.log(response);
    const parsedResponse = UserSchema.safeParse(response.data.data);

    if (parsedResponse.success) {
      UserStore.getState().setUser(parsedResponse.data);
      sessionStorage.setItem("user", JSON.stringify(parsedResponse.data));
      return;
    }

    console.log(
      "An error occurred while parsing the user data in LoggedUserStore: ",
      parsedResponse.error.issues
    );
  } catch (error) {
    console.log(error);
  }
}
