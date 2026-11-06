const Producto = require('../models/producto.model');
//Con esto obtenemos todos los productos disponibles
exports.getAllProducts = async (req, res) => {
try {
    const productos = await Producto.findAll();
    res.json(productos);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

//Busca productos por su ID unico
exports.getProductById = async (req, res) => {
try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

//Crea los productos con las validaciones necesarias para no incrustar
// datos basura (precio > 0, stock > 0 o !nombre)
exports.createProduct = async (req, res) => {
try {
    const { nombre, categoria, precio, stock } = req.body;

    // Validaciones de negocio exigidas por el proyecto
    if (precio <= 0) {
    return res.status(400).json({ error: 'El precio debe ser mayor a 0.' });
    }
    if (stock <= 0) {
    return res.status(400).json({ error: 'La existencia (stock) debe ser mayor a 0.' });
    }
    if(!nombre || !categoria){
    return res.status(400).json({ error: 'Faltan datos importantes.' });
    }

    const nuevoProducto = await Producto.create({
    nombre,
    categoria,
    precio,
    stock
    });

    res.status(201).json(nuevoProducto);
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

//Actualizamos el priducto deseado
exports.updateProduct = async (req, res) => {
try {
    const { id } = req.params;
    const { nombre, categoria, precio, stock } = req.body;

    // Validaciones opcionales en caso de que se envíen en el update
    if (precio !== undefined && precio <= 0) {
    return res.status(400).json({ error: 'El precio debe ser mayor a 0.' });
    }
    if (stock !== undefined && stock <= 0) {
    return res.status(400).json({ error: 'La existencia (stock) debe ser mayor a 0.' });
    }
    if(!nombre || !categoria){
    return res.status(400).json({ error: 'Faltan datos importantes.' });
    }

    const [updated] = await Producto.update(req.body, { where: { id } });
    if (!updated) {
    return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
    }

    const productoActualizado = await Producto.findByPk(id);
    res.json(productoActualizado);
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

//Eliminacion de un producto
exports.deleteProduct = async (req, res) => {
try {
    const { id } = req.params;
    const deleted = await Producto.destroy({ where: { id } });
    if (!deleted) {
    return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

//Nuestra funcion para descontar los productos que seran consumidos por medio de
//de servicio de pedidos 
exports.discountStock = async (req, res) => {
try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (producto.stock < cantidad) {
    return res.status(400).json({ error: 'Stock insuficiente para procesar el pedido' });
    }

    producto.stock -= cantidad;
    await producto.save();

    res.json({ message: 'Stock actualizado exitosamente', producto });
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
};