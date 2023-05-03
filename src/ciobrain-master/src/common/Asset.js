import axios from "axios"
import dotenv from 'dotenv';
import { AssetCategoryEnum } from "../components/AssetCategoryEnum.js"
dotenv.config()

console.log(process.env)

// adding asset here for convenience
// baseURL should be the base URL and routes should be part of routing
const URL =
    process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_LOCAL}/asset`
        : `${process.env.REACT_APP_API}/asset`
const api = axios.create({ baseURL: URL })
//const api = axios.create({ baseURL: `${process.env.REACT_APP_API}/asset` })

const get = async url => {
    try {
        return (await api.get(url)).data
    } catch (error) {
        console.log(error)
    }
}

const post = async (url, data) => {
    try {
        console.log(url)
        return (await api.post(url, data)).data
    } catch (error) {
        console.log(error)
    }
}

const deleteA = async (url, data) => {
    try {
        return (await api.delete(url, data)).data
    } catch (error) {
        console.log(error)
    }
}

export const getAssetById = async (category, id) =>
    await get(`/${category}/${id}`)

export const getAssetChildrenById = async (category, id) =>
    await get(`/${category}/${id}/children`)

export const getAllAssetsForCategory = async category =>
    await get(`/${category}`)

export const pushAssets = async (category, assets) =>
    await post(`/${category}`, assets)

export const deleteAsset = async(category,id) =>
    await deleteA(`/${category}/${id}`)

export const getAllAssets = async () =>
    (
        await Promise.all(
            Object.values(AssetCategoryEnum).map(c =>
                getAllAssetsForCategory(c.name)
            )
        )
    ).flat()
