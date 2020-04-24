#pragma once

#include <d3d11_1.h>

#include <OCIdl.h>
#include <functional>


namespace DirectX
{
    HRESULT __cdecl SaveDDSTextureToFile(
        _In_ ID3D11DeviceContext* pContext,
        _In_ ID3D11Resource* pSource,
        _In_z_ const wchar_t* fileName);

    HRESULT __cdecl SaveWICTextureToFile(
        _In_ ID3D11DeviceContext* pContext,
        _In_ ID3D11Resource* pSource,
        _In_ REFGUID guidContainerFormat,
        _In_z_ const wchar_t* fileName,
        _In_opt_ const GUID* targetFormat = nullptr,
        _In_opt_ std::function<void __cdecl(IPropertyBag2*)> setCustomProps = nullptr,
        _In_ bool forceSRGB = false);
}
