import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Cottage from "../models/Cottage";

const JWT_SECRET = "o3vYyNlgK8uNWdVYjmpsplNlV2RlGBZSc77Rz4L45"; 

// zda je admin 
const isAdmin = (authHeader: string | undefined): boolean => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { isAdmin: boolean };
    return decoded.isAdmin;
  } catch {
    return false;
  }
};
export const createCottage = async (req: Request, res: Response): Promise<void> => {
  if (!isAdmin(req.headers.authorization)) {
    res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
    return;
  }

  try {
    const {
      name,
      maxPeopleCount,
      roomCount,
      wifi,
      animal_allowed,
      bedding_available,
      parking_available,
      rent_per_day,
      region,
      description,
      image_urls,
      latitude,
      longitude, // Nové
    } = req.body;

    if (!latitude || !longitude) {
      res.status(400).json({ message: "Musíte poskytnout platné souřadnice (latitude a longitude)." });
      return;
    }

    const newCottage = new Cottage({
      name,
      maxPeopleCount,
      roomCount,
      wifi,
      animal_allowed,
      bedding_available,
      parking_available,
      rent_per_day,
      region,
      description,
      image_urls,
      latitude, // Uložení souřadnic
      longitude,
    });

    const savedCottage = await newCottage.save();
    res.status(201).json(savedCottage);
  } catch (error) {
    res.status(500).json({ message: "Chyba při vytváření chaty.", error: (error as Error).message });
  }
};

// vsechny chaty
export const getCottages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cottages = await Cottage.find();
    res.status(200).json(cottages);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání chat.", error: (error as Error).message });
  }
};

// id chaty
export const getCottageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const cottage = await Cottage.findById(req.params.id);
    if (!cottage) {
      res.status(404).json({ message: "Chata nenalezena." });
      return;
    }
    res.status(200).json(cottage);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání chaty.", error: (error as Error).message });
  }
};

// aktualizace chaty pro admina
export const updateCottageById = async (req: Request, res: Response): Promise<void> => {
  if (!isAdmin(req.headers.authorization)) {
    res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
    return;
  }
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedCottage = await Cottage.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedCottage) {
      res.status(404).json({ message: "Chata nenalezena." });
      return;
    }

    res.status(200).json(updatedCottage);
  } catch (error) {
    res.status(500).json({ message: "Chyba při aktualizaci chaty.", error: (error as Error).message });
  }
};

// smazani chat
export const deleteCottageById = async (req: Request, res: Response): Promise<void> => {
  if (!isAdmin(req.headers.authorization)) {
    res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
    return;
  }
  try {
    const { id } = req.params;
    const deletedCottage = await Cottage.findByIdAndDelete(id);
    if (!deletedCottage) {
      res.status(404).json({ message: "Chata nenalezena." });
      return;
    }

    res.status(200).json({ message: "Chata byla úspěšně smazána." });
  } catch (error) {
    res.status(500).json({ message: "Chyba při mazání chaty.", error: (error as Error).message });
  }
};
//filtrovani chat
// 
// export const filterCottages = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const {
//       region,
//       minPrice,
//       maxPrice,
//       maxPeopleCount,
//       roomCount,
//       wifi,
//       bedding_available,
//       parking_available,
//       animal_allowed,
//     } = req.body;

//     const filterConditions: any = {};

//     // Filtrování podle regionu
//     if (region) filterConditions.region = region;

//     // Filtrování podle ceny
//     if (minPrice) filterConditions.rent_per_day = { ...filterConditions.rent_per_day, $gte: Number(minPrice) };
//     if (maxPrice) filterConditions.rent_per_day = { ...filterConditions.rent_per_day, $lte: Number(maxPrice) };

//     // Filtrování podle maximálního počtu osob
//     if (maxPeopleCount) filterConditions.maxPeopleCount = { $gte: Number(maxPeopleCount) };

//     // Filtrování podle počtu pokojů
//     if (roomCount) filterConditions.roomCount = { $gte: Number(roomCount) };

//     // Boolean filtry
//     if (typeof wifi === "boolean") filterConditions.wifi = wifi;
//     if (typeof bedding_available === "boolean") filterConditions.bedding_available = bedding_available;
//     if (typeof parking_available === "boolean") filterConditions.parking_available = parking_available;
//     if (typeof animal_allowed === "boolean") filterConditions.animal_allowed = animal_allowed;

//     // Hledání chat podle filtru
//     const cottages = await Cottage.find(filterConditions);

//     res.status(200).json(cottages);
//   } catch (error) {
//     res.status(500).json({
//       message: "Chyba při filtrování chat.",
//       error: (error as Error).message,
//     });
//   }
// };
export const filterCottages = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      region, // Filtrování podle kraje
      touristAreas, // Seznam turistických oblastí (pole)
      minPrice,
      maxPrice,
      maxPeopleCount,
      roomCount,
      wifi,
      bedding_available,
      parking_available,
      animal_allowed,
    } = req.body;

    const filterConditions: any = {};

    // 🌍 Filtrování podle regionu (kraje)
    if (region) filterConditions.region = region;

    // 🏔️ Filtrování podle turistických oblastí (může být více oblastí)
    if (Array.isArray(touristAreas) && touristAreas.length > 0) {
      filterConditions.touristAreas = { $in: touristAreas };
    }

    // 💰 Filtrování podle ceny
    if (minPrice) filterConditions.rent_per_day = { ...filterConditions.rent_per_day, $gte: Number(minPrice) };
    if (maxPrice) filterConditions.rent_per_day = { ...filterConditions.rent_per_day, $lte: Number(maxPrice) };

    // 👥 Filtrování podle maximálního počtu osob
    if (maxPeopleCount) filterConditions.maxPeopleCount = { $gte: Number(maxPeopleCount) };

    // 🏡 Filtrování podle počtu pokojů
    if (roomCount) filterConditions.roomCount = { $gte: Number(roomCount) };

    // 📡 Boolean filtry (wifi, lůžkoviny, parkování, zvířata)
    if (typeof wifi === "boolean") filterConditions.wifi = wifi;
    if (typeof bedding_available === "boolean") filterConditions.bedding_available = bedding_available;
    if (typeof parking_available === "boolean") filterConditions.parking_available = parking_available;
    if (typeof animal_allowed === "boolean") filterConditions.animal_allowed = animal_allowed;

    // 🔍 Hledání chat podle filtrů
    const cottages = await Cottage.find(filterConditions);

    res.status(200).json(cottages);
  } catch (error) {
    res.status(500).json({
      message: "Chyba při filtrování chat.",
      error: (error as Error).message,
    });
  }
};