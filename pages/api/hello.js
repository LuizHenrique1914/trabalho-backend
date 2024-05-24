

export default async function handler(req, res) {

  if (req.method === "GET") {
    const id = req.query.id;
    console.log("", id);

    if (id === undefined) {
      const usuarios = await db.all("SELECT * from Usuarios");

      res.status(200).json(usuarios);
    } else {
      const usuario = await db.get("SELECT * from Usuarios WHERE id = ?", [id]);
      res.status(200).json(usuario);
    }
  }

  if (req.method === "POST") {
    const new_usuario = req.body;

    console.log("====================================");
    console.log(new_usuario.nome, new_usuario.email);
    console.log("====================================");

    if (new_usuario.nome === undefined || new_usuario.nome === "") {
      res.status(402).json({message: "nome é obrigatorio!"});
    }

    if (new_usuario.email === undefined || new_usuario.email === "") {
      res.status(402).json({message: "email é obrigatorio!"});
    }

    const createUser = await db.prepare(
      "INSERT INTO Usuarios (nome, email) VALUES (?, ?);"
    );

    const runCreat = await createUser.run(new_usuario.nome, new_usuario.email);

    res.status(201).json({});
  }

  if (req.method === "PUT") {
    const update_usuario = req.body;

    const valid_usuario = await db.get("SELECT * from Usuarios WHERE id = ?", [
      update_usuario.id,
    ]);
    if (valid_usuario === undefined) {
      res.status(404).json({});
    }

    const updateUsuario = await db.prepare(
      "UPDATE Usuarios SET nome = ?, email = ? WHERE id = ?"
    );
    const runCreat = await updateUsuario.run(
      update_usuario.nome,
      update_usuario.email,
      update_usuario.id
    );

    res.status(200).json({});
  }

  if (req.method === "DELETE") {
    const ID = req.body.id;

    const valid_usuario = await db.get("SELECT * from Usuarios WHERE id = ?", [
      ID,
    ]);
    if (valid_usuario === undefined) {
      res.status(404).json({});
    }

    const deleteUsuario = await db.prepare(
      "DELETE FROM Usuarios WHERE id = ?;"
    );

    const delete_Usuario = await deleteUsuario.run(ID);

    res.status(201).json({});
  }
}
