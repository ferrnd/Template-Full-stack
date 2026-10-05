import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
    const { id } = await params;

    try {
        const response = await axios.get(`${process.env.URL_SERIES}/${id}`, {
            headers: { 'x-api-key': process.env.API_KEY },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        const data = error.response?.data || { message: 'Erro ao buscar a série.' };

        return NextResponse.json(data, { status });
    }
}

export async function PUT(request, { params }) {
    const { id } = await params;

    try {
        const body = await request.json();
        const response = await axios.put(`${process.env.URL_SERIES}/${id}`, body, {
            headers: { 'x-api-key': process.env.API_KEY },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        const data = error.response?.data || { message: 'Erro ao atualizar a série.' };

        return NextResponse.json(data, { status });
    }
}

export async function DELETE(_request, { params }) {
    const { id } = await params;

    try {
        const response = await axios.delete(`${process.env.URL_SERIES}/${id}`, {
            headers: { 'x-api-key': process.env.API_KEY },
        });

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        return NextResponse.json(response.data ?? {}, { status: response.status });
    } catch (error) {
        const status = error.response?.status || 500;
        const data = error.response?.data || { message: 'Erro ao excluir a série.' };

        return NextResponse.json(data, { status });
    }
}