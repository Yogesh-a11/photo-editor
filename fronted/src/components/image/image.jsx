import { IKImage } from "imagekitio-react"


const Image = ({path,src, alt,classname,w,h}) => {
    return (
        <IKImage
                urlEndpoint={import.meta.env.VITE_URL_IK_ENDPOINT}
                path={path}
                src={src}
                loading="lazy"
                lqip={{ active: true, quality: 20 }}
                transformation={[
                    {
                        width: w,
                        height: h 
                    }
                ]}
                alt={alt}
                className={classname}
            />  
    )
}

export default Image