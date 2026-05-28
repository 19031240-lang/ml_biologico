const login = async (e) => {

  e.preventDefault();

  try {

    const res = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    localStorage.setItem(
      "usuario",
      JSON.stringify(res.data.user)
    );

    window.location.href = "/dashboard";

  } catch (error) {

    alert("Credenciales incorrectas");

  }

};