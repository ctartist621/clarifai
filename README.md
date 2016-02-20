[![Circle CI](https://circleci.com/gh/ctartist621/clarifai/tree/master.svg?style=svg&circle-token=e15ad7ff3e856e1b86fb002868fb4c9e98d4e22e)](https://circleci.com/gh/ctartist621/clarifai/tree/master) [![npm version](https://badge.fury.io/js/clarifai.svg)](https://badge.fury.io/js/clarifai) [![Codacy Badge](https://api.codacy.com/project/badge/grade/fd34502ca14c4c0ba556e90a81d77991)](https://www.codacy.com/app/ctartist621/clarifai) [![Codacy Badge](https://api.codacy.com/project/badge/coverage/fd34502ca14c4c0ba556e90a81d77991)](https://www.codacy.com/app/ctartist621/clarifai) [![Dependency Status](https://david-dm.org/ctartist621/clarifai.svg)](https://david-dm.org/ctartist621/clarifai) [![devDependency Status](https://david-dm.org/ctartist621/clarifai/dev-status.svg)](https://david-dm.org/ctartist621/clarifai#info=devDependencies)

# clarifai
A Node integration library for [Clarifai](http://clarifai.com/), a very cool content tagging api.


## Installation

First, the all necessary
```
npm install clarifai --save
```

To initialize the library, you can either pass it in a settings object with the Clarifai ID & Secret,

```
var Clarifai = require('clarifai')
client = new Clarifai({
  id: <clarifai id>,
  secret: <clarifai secret>
})
```

Or save them as environment variables, as the library will also look for them in these two variables:
```
process.env.CLARIFAI_ID
process.env.CLARIFAI_SECRET
```
And initializing is simply
```
client = new Clarifai()
```

## Authentication
Once initialized, the library will take care of renewing the access token as it expires.  If you need to OAuth for an access token, you can simply call:
```
client.getAccessToken(function(err, accessToken) {
  // Callback code here
})
```

## Tagging

###  Image Tagging via URL
```
client.tagFromUrls('image', url, function(err, results) {
  // Callback code here
}, [language])
```
This function will take one image URL, or many image URLs as an array.  The language parameter is optional, and will request tags from Clarifai in the appropriate language.

The callback returns the standard error/results.  The results object returned has the following structure:
```
{
  docId: 15512461224882630000,
  docIdStr: '31fdb2316ff87fb5d747554ba5267313',
  tags: [
    {
      class: 'train',
      conceptId: 'ai_HLmqFqBf',
      probability: 0.9989112019538879
    },
    {
      class: 'railway',
      conceptId: 'ai_fvlBqXZR',
      probability: 0.9975532293319702
    },
    {
      class: 'transportation system',
      conceptId: 'ai_Xxjc3MhT',
      probability: 0.9959157705307007
    },
    {
      class: 'station',
      conceptId: 'ai_6kTjGfF6',
      probability: 0.9925730228424072
    },
    {
      class: 'train',
      conceptId: 'ai_RRXLczch',
      probability: 0.9925559759140015
    },
    {
      class: 'travel',
      conceptId: 'ai_VRmbGVWh',
      probability: 0.9878921508789062
    },
    {
      class: 'tube',
      conceptId: 'ai_SHNDcmJ3',
      probability: 0.9816359281539917
    },
    {
      class: 'commuter',
      conceptId: 'ai_jlb9q33b',
      probability: 0.9712483286857605
    },
    {
      class: 'railway',
      conceptId: 'ai_46lGZ4Gm',
      probability: 0.9690325260162354
    },
    {
      class: 'traffic',
      conceptId: 'ai_tr0MBp64',
      probability: 0.9687051773071289
    },
    {
      class: 'blur',
      conceptId: 'ai_l4WckcJN',
      probability: 0.9667078256607056
    },
    {
      class: 'platform',
      conceptId: 'ai_2gkfMDsM',
      probability: 0.9624242782592773
    },
    {
      class: 'urban',
      conceptId: 'ai_CpFBRWzD',
      probability: 0.960752010345459
    },
    {
      class: 'no person',
      conceptId: 'ai_786Zr311',
      probability: 0.9586490392684937
    },
    {
      class: 'business',
      conceptId: 'ai_6lhccv44',
      probability: 0.9572030305862427
    },
    {
      class: 'track',
      conceptId: 'ai_971KsJkn',
      probability: 0.9494642019271851
    },
    {
      class: 'city',
      conceptId: 'ai_WBQfVV0p',
      probability: 0.940894365310669
    },
    {
      class: 'fast',
      conceptId: 'ai_dSCKh8xv',
      probability: 0.9399334192276001
    },
    {
      class: 'road',
      conceptId: 'ai_TZ3C79C6',
      probability: 0.9312160611152649
    },
    {
      class: 'terminal',
      conceptId: 'ai_VSVscs9k',
      probability: 0.9230834245681763
    }
  ]
}
```
If one image was passed in, the `results` object will be the single object representing the results for that image.  If more than one was passed in, it will be an array of `results` objects.

### Video Tagging via URL
```
client.tagFromUrls('video', url, function(err, results) {
  // Callback code here
}, [language])
```
This function will take one video URL, or many video URLs as an array.  The language parameter is optional, and will request tags from Clarifai in the appropriate language.

The callback returns the standard error/results.  The `results` object returned has the following structure:
```
{
  "docId": 13756317490038290000,
  "docIdStr": "9b1c7eabd9ac0932bee841df8339b916",
  "timestamps": [
    {
      "timestamp": 0,
      "tags": [
        {
          "class": "snow",
          "conceptId": "ai_l09WQRHT",
          "probability": 0.9933538436889648
        },
        {
          "class": "ice",
          "conceptId": "ai_jGkHfX9T",
          "probability": 0.9898617267608643
        }
        ...
        {
          "class": "sea",
          "conceptId": "ai_7bRKqWjp",
          "probability": 0.8838980793952942
        }
      ]
    },
    {
      "timestamp": 1,
      "tags": [
        {
          "class": "water",
          "conceptId": "ai_BlL0wSQh",
          "probability": 0.9734385013580322
        },
        {
          "class": "snow",
          "conceptId": "ai_l09WQRHT",
          "probability": 0.9672313332557678
        }
        ...
        {
          "class": "fair weather",
          "conceptId": "ai_41s912fX",
          "probability": 0.7390187978744507
        }
      ]
    },
    {
      "timestamp": 2,
      "tags": [
        {
          "class": "frosty",
          "conceptId": "ai_LMNcLLVR",
          "probability": 0.9763497114181519
        },
        {
          "class": "water",
          "conceptId": "ai_BlL0wSQh",
          "probability": 0.9734385013580322
        }
        ...
        {
          "class": "recreation",
          "conceptId": "ai_8Qw6PFLZ",
          "probability": 0.7853384017944336
        }
      ]
    }
    ...
  ]
}
```
Each classification is taken at 1 second keyframes by Clarifai, so each keyframe has a set of tags associated with it.  So the document's `results` object will have a timestamps array, and each timestamp will have an array of tags associated with that timestamp.

If one video was passed in, the `results` object will be the single object representing the results for that image.  If more than one was passed in, it will be an array of `results` objects.


###  Image and Video Tagging from Buffers
```
client.tagFromBuffers('image', buffer, function(err, results) {
  // Callback code here
}, [language])
```
This function will take one Buffer containing image or video data, or many Buffers as an array.  The language parameter is optional, and will request tags from clarifai in the appropriate language.

The response format is the same as for image or video URLs, as described in the previous sections.



## Feedback
For all the feedback functions, any input parameters can be a single string, or an array of strings.

Any positive response will look like:
```
{
  "status_code": "OK",
  "status_msg": "Feedback sucessfully recorded."
}
```

### Add tags or give positive feedback for tags to a docid

```
var docIds = ['78c742b9dee940c8cf2a06f860025141']
var tags = ['car','dashboard','driving']
client.addTags(docIds, tags, function(err, resp) {
  // Callback code here
})
```

### Remove tags or give negative feedback for tags to a docid
```
var docIds = ['78c742b9dee940c8cf2a06f860025141']
var tags = ['sky','clean','red']
client.removeTags(docIds, tags, function(err, resp) {
  // Callback code here
})
```

### Add similar docids for a given docid
```
var docIds = ['78c742b9dee940c8cf2a06f860025141']
var similarIds = ['fc957ec10abcc0f4507475827626200a']
client.addSimilarDocIds(docIds, similarIds, function(err, resp) {
  // Callback code here
})
```

### Add dissimilar docids for a given docid
```
var docIds = ['78c742b9dee940c8cf2a06f860025141']
var dissimilarIds = ['acd57ec10abcc0f4507475827626785f']
client.addDissimilarDocIds(docIds, dissimilarIds, function(err, resp) {
  // Callback code here
})
```

### Associate search tags for which the input docids were clicked
```
var docIds = ['78c742b9dee940c8cf2a06f860025141']
var terms = ['cat']
client.associateSearchTerms(docIds, terms, function(err, resp) {
  // Callback code here
})
```

## API Info
Retrieves information about the API.
```
client.getAPIDetails(function(err, resp) {
  // Callback code here
})
```
Response will look like:
```
{
  max_image_size: 100000,
  default_language: 'en',
  max_video_size: 100000,
  max_image_bytes: 10485760,
  min_image_size: 1,
  default_model: 'general-v1.3',
  max_video_bytes: 104857600,
  max_video_duration: 1800,
  max_batch_size: 128,
  max_video_batch_size: 1,
  min_video_size: 1,
  api_version: 0.1
}
```
