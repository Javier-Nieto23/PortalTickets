import db from '../config/database.js';

class Empresa {
  static async findAll() {
    const query = 'SELECT ID_Empresa, Nombre_Empresa, rfc FROM Empresas ORDER BY Nombre_Empresa';
    const { rows } = await db.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT ID_Empresa, Nombre_Empresa, rfc FROM Empresas WHERE ID_Empresa = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async findByName(nombreEmpresa) {
    const query = 'SELECT ID_Empresa, Nombre_Empresa, rfc FROM Empresas WHERE Nombre_Empresa = $1';
    const { rows } = await db.query(query, [nombreEmpresa]);
    return rows[0];
  }

  static async create(empresaData) {
    const { Nombre_Empresa, rfc } = empresaData;
    const query = `
      INSERT INTO Empresas (Nombre_Empresa, rfc)
      VALUES ($1, $2)
      RETURNING ID_Empresa, Nombre_Empresa, rfc
    `;
    const { rows } = await db.query(query, [Nombre_Empresa, rfc || null]);
    return rows[0];
  }

  static async findOrCreate(nombreEmpresa, rfc = null) {
    let empresa = await this.findByName(nombreEmpresa);
    if (!empresa) {
      empresa = await this.create({ Nombre_Empresa: nombreEmpresa, rfc });
    }
    return empresa;
  }

  static async update(id, empresaData) {
    const { Nombre_Empresa, rfc } = empresaData;
    const query = `
      UPDATE Empresas
      SET Nombre_Empresa = $1, rfc = $2
      WHERE ID_Empresa = $3
      RETURNING *
    `;
    const { rows } = await db.query(query, [Nombre_Empresa, rfc, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM Empresas WHERE ID_Empresa = $1';
    await db.query(query, [id]);
  }
}

export default Empresa;
