import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import database from '../../api/hello';

export default async function handler(req, res) {
  if (req.method === "GET") {
    const id = req.query.id;

    if (id === undefined) {
      try {
        const usuariosSnapshot = await getDocs(collection(database, "Usuarios"));
        const usuarios = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(usuarios);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: "Erro ao buscar usuários" });
      }
    } else {
      try {
        const usuarioDoc = await getDoc(doc(database, "Usuarios", id));
        if (usuarioDoc.exists()) {
          const usuario = { id: usuarioDoc.id, ...usuarioDoc.data() };
          res.status(200).json(usuario);
        } else {
          res.status(404).json({});
        }
      } catch (error) {
        console.error("Erro ao buscar usuário por ID:", error);
        res.status(500).json({ message: "Erro ao buscar usuário por ID" });
      }
    }
  }

  if (req.method === "POST") {
    const new_usuario = req.body;

    if (!new_usuario.nome || !new_usuario.email) {
      res.status(402).json({ message: "nome e email são obrigatórios!" });
      return;
    }

    try {
      await addDoc(collection(database, "Usuarios"), new_usuario);
      res.status(201).json({});
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      res.status(500).json({ message: "Erro ao adicionar usuário" });
    }
  }

  if (req.method === "PUT") {
    const update_usuario = req.body;

    try {
      const usuarioRef = doc(database, "Usuarios", update_usuario.id);
      const usuarioDoc = await getDoc(usuarioRef);

      if (usuarioDoc.exists()) {
        await updateDoc(usuarioRef, update_usuario);
        res.status(200).json({});
      } else {
        res.status(404).json({});
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  }

  if (req.method === "DELETE") {
    const ID = req.body.id;

    try {
      const usuarioRef = doc(database, "Usuarios", ID);
      const usuarioDoc = await getDoc(usuarioRef);

      if (usuarioDoc.exists()) {
        await deleteDoc(usuarioRef);
        res.status(201).json({});
      } else {
        res.status(404).json({});
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      res.status(500).json({ message: "Erro ao excluir usuário" });
    }
  }
}
